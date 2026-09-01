import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import type { Experience, Project, Social, Tech } from '@/types/site'
import type {
  UploadProjectMediaInput,
  UploadProjectMediaResult,
} from '@/server/admin'
import {
  deleteExperience,
  deleteProject,
  deleteSocial,
  deleteTech,
  reorderProjects,
  resetProjects,
  saveCvPath,
  saveExperience,
  saveProject,
  saveSocial,
  saveTech,
  uploadProjectMedia,
} from '@/server/admin'

interface OkResult {
  ok: boolean
}

export interface AdminMutations {
  saveProjectMutation: UseMutationResult<OkResult, Error, Project>
  uploadProjectMediaMutation: UseMutationResult<UploadProjectMediaResult, Error, UploadProjectMediaInput>
  reorderProjectsMutation: UseMutationResult<OkResult, Error, string[]>
  resetProjectsMutation: UseMutationResult<OkResult, Error, boolean>
  deleteProjectMutation: UseMutationResult<OkResult, Error, string>
  saveExperienceMutation: UseMutationResult<OkResult, Error, Experience>
  deleteExperienceMutation: UseMutationResult<OkResult, Error, string>
  saveSocialMutation: UseMutationResult<OkResult, Error, Social>
  deleteSocialMutation: UseMutationResult<OkResult, Error, number>
  saveTechMutation: UseMutationResult<OkResult, Error, Tech>
  deleteTechMutation: UseMutationResult<OkResult, Error, number>
  saveCvPathMutation: UseMutationResult<OkResult, Error, string>
}

export function useAdminMutations(
  adminKey: string,
  onNotice: (message: string | null) => void,
): AdminMutations {
  const queryClient = useQueryClient()

  const invalidate = () => {
    // Fire-and-forget: the mutation resolves immediately, the panel refreshes
    // when the refetch lands instead of keeping the save button busy.
    void queryClient.invalidateQueries({ queryKey: ['site'] })
  }

  const onError = (error: Error) => onNotice(error.message)

  const saveProjectMutation = useMutation({
    mutationFn: (project: Project) => saveProject({ data: { input: project, adminKey } }),
    onSuccess: () => {
      onNotice('Project saved')
      invalidate()
    },
    onError,
  })

  const uploadProjectMediaMutation = useMutation({
    mutationFn: (input: UploadProjectMediaInput) =>
      uploadProjectMedia({ data: { input, adminKey } }),
    onError,
  })

  const reorderProjectsMutation = useMutation({
    mutationFn: (ids: string[]) => reorderProjects({ data: { input: ids, adminKey } }),
    onSuccess: () => {
      onNotice('Project order saved')
      invalidate()
    },
    onError,
  })

  const resetProjectsMutation = useMutation({
    mutationFn: (confirmed: boolean) => resetProjects({ data: { input: confirmed, adminKey } }),
    onSuccess: () => {
      onNotice('All projects reset')
      invalidate()
    },
    onError,
  })

  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => deleteProject({ data: { input: id, adminKey } }),
    onSuccess: () => {
      onNotice('Project deleted')
      invalidate()
    },
    onError,
  })

  const saveExperienceMutation = useMutation({
    mutationFn: (experience: Experience) => saveExperience({ data: { input: experience, adminKey } }),
    onSuccess: () => {
      onNotice('Experience saved')
      invalidate()
    },
    onError,
  })

  const deleteExperienceMutation = useMutation({
    mutationFn: (id: string) => deleteExperience({ data: { input: id, adminKey } }),
    onSuccess: () => {
      onNotice('Experience deleted')
      invalidate()
    },
    onError,
  })

  const saveSocialMutation = useMutation({
    mutationFn: (social: Social) => saveSocial({ data: { input: social, adminKey } }),
    onSuccess: () => {
      onNotice('Social saved')
      invalidate()
    },
    onError,
  })

  const deleteSocialMutation = useMutation({
    mutationFn: (id: number) => deleteSocial({ data: { input: id, adminKey } }),
    onSuccess: () => {
      onNotice('Social deleted')
      invalidate()
    },
    onError,
  })

  const saveTechMutation = useMutation({
    mutationFn: (tech: Tech) => saveTech({ data: { input: tech, adminKey } }),
    onSuccess: () => {
      onNotice('Tech saved')
      invalidate()
    },
    onError,
  })

  const deleteTechMutation = useMutation({
    mutationFn: (id: number) => deleteTech({ data: { input: id, adminKey } }),
    onSuccess: () => {
      onNotice('Tech deleted')
      invalidate()
    },
    onError,
  })

  const saveCvPathMutation = useMutation({
    mutationFn: (path: string) => saveCvPath({ data: { input: path, adminKey } }),
    onSuccess: () => {
      onNotice('CV path saved')
      invalidate()
    },
    onError,
  })

  return {
    saveProjectMutation,
    uploadProjectMediaMutation,
    reorderProjectsMutation,
    resetProjectsMutation,
    deleteProjectMutation,
    saveExperienceMutation,
    deleteExperienceMutation,
    saveSocialMutation,
    deleteSocialMutation,
    saveTechMutation,
    deleteTechMutation,
    saveCvPathMutation,
  }
}
